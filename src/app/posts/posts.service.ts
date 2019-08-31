import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http:HttpClient) {}

  getPosts() {
    this.http.get<{message:string,posts:Post[]}>
    ('http://127.0.0.1:3000/api/posts').subscribe(
        res => {
          this.posts = res.posts;
          console.log(this.posts)
          this.postsUpdated.next([...this.posts]);
        }
    )
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id:'123erdsw34r',title: title, content: content};

    this.http.post<{message:string}>
    ('http://localhost:3000/api/posts',post)
        .subscribe(res => {
          console.log(res.message)
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
        })
  }
}