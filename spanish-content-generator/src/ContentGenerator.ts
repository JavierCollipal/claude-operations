/**
 * Spanish Educational Content Generator - Main Generator Class
 *
 * @author Glam Americano & Neko-Arc System
 */

import * as fs from 'fs';
import * as path from 'path';
import type { PostSeries, Post, ContentRequest, ContentStatistics } from './types';
import { generateNekoArcSystemSeries } from './templates/neko-arc-system';

export class ContentGenerator {
  private outputDir: string;

  constructor(outputDir: string = './output') {
    this.outputDir = outputDir;
    this.ensureOutputDir();
  }

  /**
   * Ensure output directory exists
   */
  private ensureOutputDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate content based on template
   */
  generateContent(template: 'neko-arc-system'): PostSeries {
    switch (template) {
      case 'neko-arc-system':
        return generateNekoArcSystemSeries();
      default:
        throw new Error(`Unknown template: ${template}`);
    }
  }

  /**
   * Export post series to Markdown files
   */
  exportToMarkdown(series: PostSeries): string[] {
    const seriesDir = path.join(this.outputDir, series.seriesId);

    // Create series directory
    if (!fs.existsSync(seriesDir)) {
      fs.mkdirSync(seriesDir, { recursive: true });
    }

    const filePaths: string[] = [];

    // Create index file
    const indexContent = this.generateIndexFile(series);
    const indexPath = path.join(seriesDir, 'README.md');
    fs.writeFileSync(indexPath, indexContent);
    filePaths.push(indexPath);

    // Export each post
    series.posts.forEach((post) => {
      const filename = `post-${post.number.toString().padStart(2, '0')}.md`;
      const filePath = path.join(seriesDir, filename);
      fs.writeFileSync(filePath, post.content);
      filePaths.push(filePath);
    });

    return filePaths;
  }

  /**
   * Generate index/README file for the series
   */
  private generateIndexFile(series: PostSeries): string {
    let content = `# ${series.title}\n\n`;
    content += `${series.description}\n\n`;
    content += `---\n\n`;
    content += `## 📚 Serie de Posts\n\n`;
    content += `**Audiencia**: ${series.targetAudience}\n`;
    content += `**Complejidad**: ${series.complexity}\n`;
    content += `**Idioma**: ${series.language}\n`;
    content += `**Total de posts**: ${series.posts.length}\n\n`;
    content += `---\n\n`;
    content += `## 📋 Contenido\n\n`;

    series.posts.forEach((post) => {
      content += `### ${post.title}\n\n`;
      content += `**Archivo**: [post-${post.number.toString().padStart(2, '0')}.md](./post-${post.number.toString().padStart(2, '0')}.md)\n`;
      content += `**Tiempo de lectura**: ~${post.estimatedReadTime} minutos\n`;
      content += `**Keywords**: ${post.keywords.join(', ')}\n`;

      if (post.diagrams && post.diagrams.length > 0) {
        content += `**Diagramas**: ${post.diagrams.length} diagram(s)\n`;
      }

      content += `\n`;
    });

    content += `---\n\n`;
    content += `## 🎸 Generado por\n\n`;
    content += `**Glam Americano** 🤘 & **Neko-Arc System** 🐾\n\n`;
    content += `*${new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}*\n`;

    return content;
  }

  /**
   * Export post series to single HTML file
   */
  exportToHTML(series: PostSeries): string {
    const seriesDir = path.join(this.outputDir, series.seriesId);

    if (!fs.existsSync(seriesDir)) {
      fs.mkdirSync(seriesDir, { recursive: true });
    }

    let html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${series.title}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
            color: #333;
        }
        .post {
            background: white;
            padding: 30px;
            margin-bottom: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #2c3e50; }
        h2 { color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h3 { color: #7f8c8d; }
        pre { background: #f8f8f8; padding: 15px; border-radius: 5px; overflow-x: auto; }
        code { background: #f8f8f8; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
        .mermaid { text-align: center; margin: 20px 0; }
        .post-meta { color: #7f8c8d; font-style: italic; margin-bottom: 20px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background: #3498db; color: white; }
        tr:nth-child(even) { background: #f2f2f2; }
    </style>
</head>
<body>
    <h1>${series.title}</h1>
    <p>${series.description}</p>
    <hr>
`;

    series.posts.forEach((post) => {
      html += `    <div class="post">
        <h2>${post.title}</h2>
        <div class="post-meta">
            📖 Tiempo de lectura: ~${post.estimatedReadTime} minutos |
            🏷️ Keywords: ${post.keywords.join(', ')}
        </div>
        ${this.markdownToSimpleHTML(post.content)}
    </div>\n`;
    });

    html += `    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
    </script>
</body>
</html>`;

    const htmlPath = path.join(seriesDir, 'series-completa.html');
    fs.writeFileSync(htmlPath, html);

    return htmlPath;
  }

  /**
   * Simple Markdown to HTML converter
   */
  private markdownToSimpleHTML(markdown: string): string {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Paragraphs
    html = html.split('\n\n').map(p => {
      if (!p.startsWith('<') && p.trim()) {
        return `<p>${p}</p>`;
      }
      return p;
    }).join('\n');

    return html;
  }

  /**
   * Get statistics about generated content
   */
  getStatistics(series: PostSeries): ContentStatistics {
    const totalWords = series.posts.reduce((sum, post) => {
      return sum + post.content.split(/\s+/).length;
    }, 0);

    const totalDiagrams = series.posts.reduce((sum, post) => {
      return sum + (post.diagrams?.length || 0);
    }, 0);

    const totalReadTime = series.posts.reduce((sum, post) => {
      return sum + post.estimatedReadTime;
    }, 0);

    return {
      seriesId: series.seriesId,
      title: series.title,
      totalPosts: series.posts.length,
      totalWords,
      totalDiagrams,
      totalReadTime: `~${totalReadTime} minutos`,
      language: series.language,
      complexity: series.complexity,
      createdAt: series.createdAt,
    };
  }
}
