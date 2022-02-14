import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GitHubIssuesApiService, IssueDetails } from '../api/github-api.service';
import { Location } from '@angular/common';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-issue-details-modal',
  templateUrl: './issue-details-modal.component.html',
  styleUrls: ['./issue-details-modal.component.scss']
})
export class IssueDetailsModalComponent implements OnInit {
  issueDetails: IssueDetails | undefined;

  constructor(
    private readonly dialogRef: MatDialogRef<IssueDetailsModalComponent>,
    private readonly githubIssuesApiService: GitHubIssuesApiService,
    private readonly location: Location,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  ngOnInit(): void {
    this.githubIssuesApiService.getIssueDetails(this.data.id).pipe(delay(1000)).subscribe(data => this.issueDetails = data);
  }

  onClose() {
    this.dialogRef.close();
    this.location.go(`issues`);
  }

}
