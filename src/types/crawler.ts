import type {ICommonTagsResult} from 'music-metadata';

export interface CrawlerType {
  name: string;
  path: string;
  type: 'audio' | 'playlist';
}

export interface ScrapeFilesType extends CrawlerType {
  meta?: ICommonTagsResult;
}
