#!/usr/bin/env node
/**
 * Spanish Educational Content Generator - CLI
 *
 * @author Glam Americano & Neko-Arc System
 */

import { Command } from 'commander';
import * as dotenv from 'dotenv';
import chalk from 'chalk';
import { ContentGenerator } from './ContentGenerator';
import { MongoLogger } from './MongoLogger';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('neko-spanish-content')
  .description('🎸 Generador de contenido educativo en español - Spanish Educational Content Generator')
  .version('1.0.0');

/**
 * Generate command
 */
program
  .command('generate')
  .description('Genera una serie de posts educativos')
  .requiredOption('-t, --template <template>', 'Template a usar: neko-arc-system')
  .option('-o, --output <path>', 'Directorio de salida', './output')
  .option('--format <format>', 'Formato: markdown, html, both', 'both')
  .option('--no-mongo', 'Deshabilitar logging a MongoDB')
  .option('--generated-by <name>', 'Generado por (personalidad)', 'glam-americano')
  .action(async (options) => {
    try {
      console.log(chalk.cyan('🎸 ¡Generador de Contenido en Español activado, hermano! 🤘\n'));

      // Initialize generator
      const generator = new ContentGenerator(options.output);

      console.log(chalk.yellow(`📝 Generando contenido con template: ${options.template}...`));

      // Generate content
      const series = generator.generateContent(options.template);

      console.log(chalk.green(`✅ Serie generada: ${series.title}`));
      console.log(chalk.gray(`   Total posts: ${series.posts.length}`));
      console.log(chalk.gray(`   Idioma: ${series.language}`));
      console.log(chalk.gray(`   Complejidad: ${series.complexity}\n`));

      // Export to formats
      let exportedFiles: string[] = [];

      if (options.format === 'markdown' || options.format === 'both') {
        console.log(chalk.yellow('📄 Exportando a Markdown...'));
        const mdFiles = generator.exportToMarkdown(series);
        exportedFiles = [...exportedFiles, ...mdFiles];
        console.log(chalk.green(`✅ ${mdFiles.length} archivos Markdown creados\n`));
      }

      if (options.format === 'html' || options.format === 'both') {
        console.log(chalk.yellow('🌐 Exportando a HTML...'));
        const htmlFile = generator.exportToHTML(series);
        exportedFiles.push(htmlFile);
        console.log(chalk.green(`✅ Archivo HTML creado\n`));
      }

      // Get statistics
      const stats = generator.getStatistics(series);
      console.log(chalk.cyan('📊 Estadísticas:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(`${chalk.bold('Serie ID:')}      ${stats.seriesId}`);
      console.log(`${chalk.bold('Total Posts:')}   ${stats.totalPosts}`);
      console.log(`${chalk.bold('Total Palabras:')} ${stats.totalWords}`);
      console.log(`${chalk.bold('Total Diagramas:')} ${stats.totalDiagrams}`);
      console.log(`${chalk.bold('Tiempo Lectura:')} ${stats.totalReadTime}`);
      console.log(chalk.gray('─'.repeat(50)));

      // Log to MongoDB if enabled
      if (options.mongo !== false) {
        const mongoUri = process.env.MONGODB_URI;
        if (mongoUri) {
          console.log(chalk.yellow('\n💾 Guardando en MongoDB...'));
          const logger = new MongoLogger(
            mongoUri,
            process.env.MONGODB_DATABASE || 'neko-defense-system',
            process.env.MONGODB_COLLECTION || 'spanish-educational-content'
          );

          await logger.connect();
          await logger.logContent(series, options.output, options.generatedBy);
          await logger.disconnect();
        } else {
          console.log(chalk.yellow('⚠️  MONGODB_URI no encontrado, saltando logging'));
        }
      }

      // Display exported files
      console.log(chalk.cyan('\n📁 Archivos Generados:'));
      exportedFiles.forEach((file) => {
        console.log(chalk.blue(`   file://${file}`));
      });

      console.log(chalk.magenta('\n🎸 ¡Contenido generado exitosamente, hermano! 🤘\n'));

      process.exit(0);
    } catch (error) {
      console.error(chalk.red('\n❌ Error generando contenido:'), error);
      process.exit(1);
    }
  });

/**
 * List templates command
 */
program
  .command('templates')
  .description('Lista los templates disponibles')
  .action(() => {
    console.log(chalk.cyan('🎸 Templates Disponibles:\n'));
    console.log(chalk.yellow('1. neko-arc-system'));
    console.log(chalk.gray('   Explica el sistema de IA Neko-Arc en español'));
    console.log(chalk.gray('   4 posts completos con diagramas Mermaid'));
    console.log(chalk.gray('   Audiencia: Comunidad hispanohablante\n'));
    console.log(chalk.cyan('Uso:'));
    console.log(chalk.white('  npm run generate -- generate -t neko-arc-system\n'));
  });

/**
 * List generated content command
 */
program
  .command('list')
  .description('Lista contenido generado desde MongoDB')
  .option('-l, --language <lang>', 'Filtrar por idioma', 'es')
  .action(async (options) => {
    try {
      console.log(chalk.cyan('🎸 Listando contenido generado...\n'));

      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        console.error(chalk.red('❌ Error: MONGODB_URI no encontrado en .env'));
        process.exit(1);
      }

      const logger = new MongoLogger(mongoUri);
      await logger.connect();

      const records = options.language
        ? await logger.getRecordsByLanguage(options.language)
        : await logger.getAllRecords();

      console.log(chalk.cyan(`📚 Encontrados ${records.length} registro(s)\n`));

      records.forEach((record, index) => {
        console.log(chalk.gray(`${index + 1}. ─────────────────────────────────────────`));
        console.log(`${chalk.bold('Título:')}       ${record.title}`);
        console.log(`${chalk.bold('Serie ID:')}     ${record.seriesId}`);
        console.log(`${chalk.bold('Posts:')}        ${record.numPosts}`);
        console.log(`${chalk.bold('Idioma:')}       ${record.language}`);
        console.log(`${chalk.bold('Complejidad:')}  ${record.complexity}`);
        console.log(`${chalk.bold('Generado por:')} ${record.generatedBy}`);
        console.log(`${chalk.bold('Fecha:')}        ${record.createdAt.toLocaleDateString('es-ES')}`);
        console.log(`${chalk.bold('Ubicación:')}    ${chalk.blue(record.outputPath)}`);
      });

      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.magenta('\n🎸 ¡Lista completa, hermano! 🤘\n'));

      await logger.disconnect();
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('\n❌ Error listando contenido:'), error);
      process.exit(1);
    }
  });

program.parse();
