/**
 * Spanish Educational Content Generator
 *
 * Generador de contenido educativo en español sobre sistemas de IA
 *
 * @author Glam Americano & Neko-Arc System
 * @version 1.0.0
 */

export { ContentGenerator } from './ContentGenerator';
export { MongoLogger } from './MongoLogger';
export { generateNekoArcSystemSeries } from './templates/neko-arc-system';
export type {
  PostSeries,
  Post,
  Diagram,
  ContentRequest,
  ContentRecord,
  SpanishContentGeneratorConfig,
  DiagramType,
  ContentComplexity,
  ContentFormat,
} from './types';
