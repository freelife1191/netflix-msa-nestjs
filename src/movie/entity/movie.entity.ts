import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { MovieDetail } from './movie-detail.entity';
import { Director } from 'src/director/entity/director.entity';
import { Genre } from 'src/genre/entity/genre.entity';

// ManyToOne Director -> 감독은 여러개의 영화를 만들 수 있음
// OneToOne MovieDetail -> 영화는 하나의 상세 내용을 갖을 수 있음
// ManyToMany Genre -> 영화는 여러개의 장르를 갖을 수 있고 장르는 여러개의 영화에 속할 수 있음

@Entity()
export class Movie extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true, // 중복 불가
  })
  title: string;

  @ManyToMany(() => Genre, genre => genre.movies)
  @JoinTable()
  genres: Genre[];

  @OneToOne(() => MovieDetail, movieDetail => movieDetail.id, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn() // 소유는 쪽에 설정 영화와 상세 내용을 조인하기 위해 사용
  detail: MovieDetail;

  @ManyToOne(() => Director, director => director.id, {
    cascade: true,
    nullable: true,
  })
  director: Director;
}
