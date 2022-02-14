import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';

export interface GithubIssuesDTO {
  items: GithubIssue[];
  total_count: number;
}

export interface GithubIssue {
  created_at: string;
  number: string;
  state: string;
  title: string;
}

export interface IssueDetails {
  state: string;
  created_at: string;
  updated_at: string;
  comments: number;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class GitHubIssuesApiService {
  private readonly baseUrl = 'https://api.github.com';

  constructor(private httpClient: HttpClient) {}

  getIssues(sort: string, order: SortDirection, page: number, stateFilter: string): Observable<GithubIssuesDTO> {
    const stateFilterQueryRequest = stateFilter === 'all' ? '' : `is:${stateFilter}`;
    const params = {
      q: `repo:angular/components ${stateFilterQueryRequest}`,
      sort,
      order,
      page: page + 1
    };

    return this.httpClient.get<GithubIssuesDTO>(`${this.baseUrl}/search/issues`, { params });
  }

  getIssueDetails(id: string): Observable<IssueDetails> {
    return this.httpClient.get<IssueDetails>(`${this.baseUrl}/repos/angular/components/issues/${id}`);
  }
}
