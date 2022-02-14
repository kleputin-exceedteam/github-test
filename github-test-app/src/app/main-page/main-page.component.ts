import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { GithubIssue, GitHubIssuesApiService } from '../api/github-api.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

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

  constructor(private readonly gitHubIssuesApiService: GitHubIssuesApiService) {}

  ngOnInit() {
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
    ).subscribe(
      data => {
        this.isRateLimitReached = data === null;

        if (data === null) {
          this.data = [];
          return;
        }

        this.resultsLength = data.total_count;
        this.data = data.items;
        this.isLoadingResults = false;
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
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
}


