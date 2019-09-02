import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import { PostsService } from "../posts.service";
import { ActivatedRoute } from '@angular/router';
import { mimetype } from '../mime-type.validator';

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {

  isEditMode=false;
  editIndex=null;
  form : FormGroup;
  imagePreview:string;
  constructor(public postsService: PostsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
        'title':new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
        'content': new FormControl(null,{validators:[Validators.required]}),
        'image': new FormControl(null,[Validators.required],[mimetype])
    });

    this.route.params
        .subscribe(
            params => {
              let index = +params['id'];
              if(index){
                this.isEditMode = true;
                this.editIndex = index;
                let post = this.postsService.getPost(index);
                setTimeout(() => {
                  if(post)
                    this.form.setValue({title:post.title,content:post.content})
                })
              }

            }
        )
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    if(this.isEditMode){
      this.postsService.editForm(this.form.value.title, this.form.value.content,this.editIndex)
      this.isEditMode = false;
    }else {
        this.postsService.addPost(this.form.value.title, this.form.value.content);
    }
    this.form.reset();
  }

    onFilePicked(event: Event) {

      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({image: file});
      this.form.get('image').updateValueAndValidity();
      let reader = new FileReader();
      reader.onload = ()=> {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
}
