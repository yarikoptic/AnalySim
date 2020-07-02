import { Component, OnInit, Input } from '@angular/core';
import { ApplicationUser } from 'src/app/interfaces/user';
import { AccountService } from 'src/app/services/account.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {

  constructor(private accountService : AccountService,
    private router : Router) { }

  @Input() profile : ApplicationUser
  currentUser$ : Observable<ApplicationUser>
  currentUser : ApplicationUser = null
  isFollowing : boolean = false

  async ngOnInit() {
    if(this.accountService.checkLoginStatus()){
      await this.accountService.currentUser.then((x) => this.currentUser$ = x)
      this.currentUser$.subscribe(x => this.currentUser = x)
    }
  }

  followUser(){
    if(!this.accountService.checkLoginStatus())
      this.router.navigate(['/login'], {queryParams: {returnUrl : this.router.url}})

    this.accountService.follow(this.profile.id, this.currentUser.id).subscribe(
      result =>{
        this.isFollowing = true
        this.profile.followers.push(result)
      }, error =>{
        console.log(error)
      }
    )
  }

  unFollowUser(){
    this.accountService.unfollow(this.profile.id, this.currentUser.id).subscribe(
      result =>{
        this.isFollowing = false
        let index = this.profile.followers.indexOf(result)
        this.profile.followers.splice(index, 1)      
      }, error =>{
        console.log(error)
      }
    )
  }

}
