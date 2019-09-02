import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import {Router} from '@angular/router';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postsService: PostsService,
              private router:Router) {}

  ngOnInit() {
      this.postsService.getPosts();

      this.postsSub = this.postsService.getPostUpdateListener()
          .subscribe((posts: Post[]) => {
          this.posts = posts;
      });
  }

  onEdit(index: number){
    this.router.navigate(['edit',index]);
  }

  onDelete(postId: string, index: number) {
    this.postsService.deletePost(postId, index);
  }


  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
