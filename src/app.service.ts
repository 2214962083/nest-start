import {Injectable} from '@nestjs/common'

@Injectable()
export class AppService {
  welcome(): string {
    return 'welcome for use nest-start'
  }
}
