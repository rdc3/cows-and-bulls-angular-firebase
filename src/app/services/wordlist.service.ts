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
    const frequency = ['10', '20', '35', '40', '50', '55', '60', '70'];
    const dialects = ['american', 'australian', 'british', 'canadian', 'english']
    this.getJSON(`https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json`).subscribe((data: string[]) => {
      data = Object.keys(data).filter((word, index, self) => word.length === 4 &&  // 4 letter words
        !word.split("").some((v: any, i: number, a: string[]) => { return a.lastIndexOf(v) != i; }) &&  // no repeated letters
        self.indexOf(word) === index  // no duplicates
      );
      this.wordlist.push(...data);
      this.wordlist = this.wordlist.sort();
      this.loadingService.increaseLoadPercentage(1000 / ((frequency.length * dialects.length) + 10));
    });
    dialects.forEach(d => {
      frequency.forEach(f => {
        this.getJSON(`./assets/wordlist-english/${d}-words-${f}.json`).subscribe((data: string[]) => {
          data = data.filter((word, index, self) => word.length === 4 &&  // 4 letter words
            !word.split("").some((v: any, i: number, a: string[]) => { return a.lastIndexOf(v) != i; }) &&  // no repeated letters
            self.indexOf(word) === index  // no duplicates
          );
          this.wordlist.push(...data);
          this.wordlist = this.wordlist.sort();
          this.loadingService.increaseLoadPercentage(100 / ((frequency.length * dialects.length) + 10));
        });
      });
    })
  }
  private getJSON(file: string): Observable<any> {
    return this.http.get(`${file}`);
  }
  public isValidWord(word: string): boolean {
    return this.wordlist.some(w => w === word);
  }
}
