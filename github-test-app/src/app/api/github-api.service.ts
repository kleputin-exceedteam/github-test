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

@Injectable({
  providedIn: 'root'
})
export class GitHubIssuesApiService {
  private readonly baseUrl = 'https://api.github.com';

  constructor(private httpClient: HttpClient) {}

  getIssues(sort: string, order: SortDirection, page: number): Observable<GithubIssuesDTO> {
    const params = {
      q: 'repo:angular/components',
      sort,
      order,
      page: page + 1
    };

    return this.httpClient.get<GithubIssuesDTO>(`${this.baseUrl}/search/issues`, { params });
  }
}
