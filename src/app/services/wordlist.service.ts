import { LoadingService } from './loading.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordlistService {
  private wordlist: string[] = [];
  constructor(private http: HttpClient, private loadingService: LoadingService) {
    this.loadingService.openDialog();
    const wordFilesCount = 17;
    for (var f = 1; f <= wordFilesCount; f++) {
      this.getJSON(`./assets/wordlist-english/words-${f}.json`).subscribe((data: string[]) => {
        data = data?.filter((word, index, self) => word.length === 4 &&  // 4 letter words
          !word.split("").some((v: any, i: number, a: string[]) => { return a.lastIndexOf(v) != i; }) &&  // no repeated letters
          self.indexOf(word) === index  // no duplicates
        ) || [];
        this.wordlist.push(...data);
        this.wordlist = this.wordlist.sort().filter((word, index, self) => self.indexOf(word) === index);
        this.loadingService.increaseLoadPercentage(+(100 / wordFilesCount).toFixed(0));
      });
    }
  }
  private getJSON(file: string): Observable<any> {
    return this.http.get(`${file}`);
  }
  public isValidWord(word: string): boolean {
    return this.wordlist.some(w => w === word);
  }
}
