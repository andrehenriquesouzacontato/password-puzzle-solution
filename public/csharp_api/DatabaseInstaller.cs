
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

namespace SistemaFidelidade.Database
{
    public class DatabaseInstaller
    {
        private readonly string _connectionString;
        private readonly string _databaseName;

        public DatabaseInstaller(IConfiguration configuration)
        {
            // Use master database initially to create our database
            var builder = new SqlConnectionStringBuilder(configuration.GetConnectionString("DefaultConnection"));
            _databaseName = builder.InitialCatalog;
            builder.InitialCatalog = "master";
            _connectionString = builder.ConnectionString;
        }

        public async Task InstallDatabaseAsync()
        {
            try
            {
                Console.WriteLine("Iniciando instalação do banco de dados...");

                // Check if database exists and create it if it doesn't
                await CreateDatabaseIfNotExistsAsync();

                // Run the database schema script
                await RunDatabaseScriptAsync();

                Console.WriteLine("Instalação do banco de dados concluída com sucesso!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro na instalação do banco de dados: {ex.Message}");
                throw;
            }
        }

        private async Task CreateDatabaseIfNotExistsAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                string checkDbQuery = $"SELECT COUNT(*) FROM sys.databases WHERE name = '{_databaseName}'";
                bool dbExists = false;

                using (var command = new SqlCommand(checkDbQuery, connection))
                {
                    var result = await command.ExecuteScalarAsync();
                    dbExists = Convert.ToInt32(result) > 0;
                }

                if (!dbExists)
                {
                    Console.WriteLine($"Criando banco de dados: {_databaseName}");
                    string createDbQuery = $"CREATE DATABASE {_databaseName}";
                    
                    using (var command = new SqlCommand(createDbQuery, connection))
                    {
                        await command.ExecuteNonQueryAsync();
                    }
                    Console.WriteLine("Banco de dados criado com sucesso.");
                }
                else
                {
                    Console.WriteLine($"Banco de dados '{_databaseName}' já existe.");
                }
            }
        }

        private async Task RunDatabaseScriptAsync()
        {
            // Read the SQL script from the file
            string scriptPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "sql_scripts", "database_schema.sql");
            string script = await File.ReadAllTextAsync(scriptPath);

            // Split script by GO statements to execute batches
            string[] batches = script.Split(new[] { "GO" }, StringSplitOptions.RemoveEmptyEntries);

            // Create a connection string for the newly created database
            var builder = new SqlConnectionStringBuilder(_connectionString);
            builder.InitialCatalog = _databaseName;
            string dbConnectionString = builder.ConnectionString;

            using (var connection = new SqlConnection(dbConnectionString))
            {
                await connection.OpenAsync();

                foreach (string batch in batches)
                {
                    if (!string.IsNullOrWhiteSpace(batch))
                    {
                        using (var command = new SqlCommand(batch, connection))
                        {
                            try
                            {
                                await command.ExecuteNonQueryAsync();
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Erro ao executar batch SQL: {ex.Message}");
                                Console.WriteLine($"Batch: {batch}");
                                throw;
                            }
                        }
                    }
                }
            }

            Console.WriteLine("Script de banco de dados executado com sucesso.");
        }
    }

    class Program
    {
        static async Task Main(string[] args)
        {
            try
            {
                // Build configuration
                IConfiguration configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                    .Build();

                // Create the installer and run it
                var installer = new DatabaseInstaller(configuration);
                await installer.InstallDatabaseAsync();

                Console.WriteLine("Instalação concluída com sucesso.");
                Console.WriteLine("Pressione qualquer tecla para sair...");
                Console.ReadKey();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro na instalação: {ex.Message}");
                Console.WriteLine("Pressione qualquer tecla para sair...");
                Console.ReadKey();
            }
        }
    }
}
