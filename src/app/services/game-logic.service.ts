import { Injectable } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Result } from '../models/types';


@Injectable({
  providedIn: 'root'
})

export class GameLogicService {
  constructor(private gameService: GameService) { }
  public checkWord(word: string): Result {
    let secret = this.gameService?.game?.round?.word || '';
    word = word.toLowerCase();
    secret = secret.toLowerCase();
    var bulls = 0;
    var cows = 0;
    const secretArray = secret.split("");
    const guessArray = word.split("");
    secretArray.forEach((key, index) => {
      if (secretArray[index] === guessArray[index]) {
        bulls = bulls + 1;
        secretArray[index] = "X";
        guessArray[index] = "Z";
      }
    });
    secretArray.forEach((key, index) => {
      if (secretArray.indexOf(guessArray[index]) >= 0) {
        secretArray[secretArray.indexOf(guessArray[index])] = "";
        cows = cows + 1;
      }
    });
    return { bulls, cows };
  }
}

