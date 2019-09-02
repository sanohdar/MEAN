import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import {Router} from '@angular/router';


@Injectable()
export class PostsService {
    private posts: Post[] = [];

    isEditMode = false;

    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient,
              private router:Router) {
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(index:number){
      if(this.posts.length>0){
          return this.posts[index];
      }
    }


  getPosts() {
        console.log('fetching posts .. ')
        this.http.get<{message: string, posts: any}>
        ('http://127.0.0.1:3000/api/posts')
            .pipe(map((resData) => {

                return resData.posts.map(eachPost => {
                    return {
                        title: eachPost.title,
                        content: eachPost.content,
                        id: eachPost._id
                    };
                });
            }))
            .subscribe(
                res => {
                    this.posts = res;
                    this.postsUpdated.next([...this.posts]);
                }
            )
  }

    editForm(title:string, content: string,index:number) {

        let editedPost = {
            title:title,
            content:content,
            id:this.posts[index].id
        }
        this.http.put<{message:string}>
        ('http://localhost:3000/edit',editedPost).subscribe(
            res => {
                this.router.navigate([''])
                console.log('editing complete :',res.message)
            }
        )

    }

  addPost(title: string, content: string) {

    const post: Post = {id: '', title, content};

    this.http.post<{message: string, id: string}>
    ('http://localhost:3000/api/posts', post)
        .subscribe(res => {
          console.log(res.message);
          post.id = res.id;
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
          this.router.navigate([''])
        });
  }


  deletePost(postId: string, index: number) {

      this.http.delete<{message: string}>
      ('http://localhost:3000/api/posts/' + postId)
          .subscribe(res => {
              console.log(res.message);
              this.posts.splice(index, 1);
              this.postsUpdated.next([...this.posts]);
          });
  }
}
