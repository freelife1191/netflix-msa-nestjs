import { Exclude, Expose } from 'class-transformer';
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class BaseTable {
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude() // 응답 데이터에 제외
  @Expose() // 응답 데이터에 포함
  updatedAt: Date;

  @VersionColumn()
  @Exclude()
  version: number;
}
