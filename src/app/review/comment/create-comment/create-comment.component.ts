import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { OfferReviewService } from 'src/app/shared/services/offer-review.service';
import { Router } from '@angular/router';
import { TutorialService } from 'src/app/shared/services/tutorial.service';
import { ShareService } from 'src/app/shared/services/share.service';
import { AngularTokenService } from 'angular-token';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss']
})
export class CreateCommentComponent implements OnInit {

  @Input() tutorial_id: number;
  @Input() offer_id: number;
  req_data: object;
  edit: boolean = false;
  show: boolean = false;
  comment_id: number;
  error: string;

  constructor(private __service: OfferReviewService,
    private router: Router,
    private __tutService: TutorialService,
    private shareService: ShareService,
    public tokenAuth: AngularTokenService) { }

  ngOnInit(): void {
    this.req_data = new Object;
    if (this.router.url.includes('blog')) {
      this.req_data['tutorial_id'] = this.tutorial_id;
    } else {
      this.currentReview();
    }
  }

  currentReview() {
    this.req_data['offer_id'] = this.offer_id;
    if (this.req_data['offer_id']) {
      this.__service.getReview(this.req_data['offer_id']).subscribe(
        (response) => {
          if (response) {
            if (response['review']) this.edit = true;
            this.req_data = response;
          }
        },
        (error) => {
          this.error = error.error.error;
        })
    }
  }

  setComment() {
    if (this.tokenAuth.userSignedIn() && this.tokenAuth['currentUserType'] == 'USER') {
      if (this.req_data['review'] && this.req_data['review'].length >= 5) {
        if (this.router.url.includes('blog')) {
          this.__tutService.setComment(this.req_data).subscribe(
            (response) => {
              if (response) {
                this.shareService.setData(response);
                this.req_data['review'] = '';
                setTimeout(() => {
                  this.show = false;
                }, 200);
              }
            },
            (error) => {
              this.error = error.error.error;
            })
        } else {
          this.req_data['offer_id'] = this.offer_id;
          if (!this.edit) {
            this.__service.setReview(this.req_data).subscribe(
              (response) => {
                if (response) {
                  setTimeout(() => {
                    this.show = false;
                    this.edit = true;
                  }, 300);
                }
              },
              (error) => {
                this.error = error.error.error;
              })
          } else {
            this.__service.updateReview(this.req_data['offer_id'], this.req_data).subscribe(
              (response) => {
                if (response) {
                  setTimeout(() => {
                    this.show = false;
                  }, 300);
                }
              },
              (error) => {
                this.error = error.error.error;
              })
          }
        }
      } else {
        this.error = "comment must be more than 5 characters";
      }
    }
  }

}
