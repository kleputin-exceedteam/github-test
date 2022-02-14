import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { GithubIssue, GitHubIssuesApiService, GithubIssuesDTO } from '../api/github-api.service';
import { IssueDetailsModalComponent } from '../issue-details-modal/issue-details-modal.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-main-page',
  styleUrls: ['main-page.component.scss'],
  templateUrl: 'main-page.component.html',
})
export class MainPageComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();

  displayedColumns: string[] = ['created', 'state', 'number', 'title'];

  data: GithubIssue[] = [];
  updateDataEventBus$ = new BehaviorSubject<boolean>(true);

  paginatorState = {
    pageIndex: 0
  }
  sortState: Sort = {
    active: 'created',
    direction: 'asc'
  }
  readonly stateFilterOptions = [{
    value: 'all',
    displayText: 'All'
  }, {
    value: 'open',
    displayText: 'Open'
  }, {
    value: 'closed',
    displayText: 'Closed'
  }];

  stateFilter = 'all';

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor(
    private readonly gitHubIssuesApiService: GitHubIssuesApiService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly location: Location
  ) {}

  ngOnInit() {
    this.handleRouteWithModalWindow();
    this.updateDataEventBus$.pipe(
      takeUntil(this.destroy$),
      switchMap(
        () => {
          this.isLoadingResults = true;
          return this.gitHubIssuesApiService.getIssues(
            this.sortState.active,
            this.sortState.direction,
            this.paginatorState.pageIndex,
            this.stateFilter
          ).pipe(
            catchError(() => of(null))
          )
        }
      )
    ).subscribe(data => this.onDataUpdate(data));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  private onDataUpdate(data: GithubIssuesDTO | null) {
    this.isRateLimitReached = data === null;

    if (data === null) {
      this.data = [];
      return;
    }

    this.resultsLength = data.total_count;
    this.data = data.items;
    this.isLoadingResults = false;
  }

  onSortChange(event: Sort) {
    this.sortState = event;
    this.paginatorState.pageIndex = 0;
    this.updateDataEventBus$.next(true);
  }

  onPageChange(event: PageEvent) {
    this.paginatorState.pageIndex = event.pageIndex;
    this.updateDataEventBus$.next(true);
  }

  onStateFilterChange() {
    this.paginatorState.pageIndex = 0;
    this.updateDataEventBus$.next(true);
  }

  handleRouteWithModalWindow() {
    const routeSnapshot = this.activatedRoute.snapshot;
    const { id } = routeSnapshot.params;
    if (id) {
      this.openModal(id);
    }
  }

  onSelectIssue(row: { number: number }) {
    this.location.go(`issue/${row.number}`);
    this.openModal(row.number);
  }

  openModal(id: number) {
    this.dialog.open(IssueDetailsModalComponent, { data: { id }, scrollStrategy: new NoopScrollStrategy() });
  }
}


