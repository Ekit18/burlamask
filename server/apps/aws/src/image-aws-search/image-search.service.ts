/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from '@nestjs/elasticsearch';

interface ImageSearchBody {
  imageId: number,
  description: string
}
interface ImageSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: ImageSearchBody;
    }>;
  };
}


@Injectable()
export default class ImageSearchService {
  readonly index = 'images';
  constructor(
    private readonly elasticsearchService: ElasticsearchService) { }


  indexImages(imageId: number, description: string) {
    return this.elasticsearchService.index<ImageSearchBody>({
      index: this.index,
      document: {
        imageId,
        description
      }
    });
  }

  async search(description: string) {
    const response = await this.elasticsearchService.search<ImageSearchBody>({
      index: this.index,
      query: {
        match: {
          description
        }
      }
    });

    const hits = response.hits.hits;
    return { result: hits.map((item) => item._source) };
  }

  remove(imageId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      query: {
        match: {
          imageId
        },
      },
    });
  }
}
