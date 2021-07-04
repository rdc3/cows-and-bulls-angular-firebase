import { GameService } from './../../services/game.service';
import { Component } from '@angular/core';
import { GameState } from 'src/app/models/types';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher as ErrorStateMatcher } from 'src/app/common/formValidationLib';
import { Consts } from 'src/app/models/consts';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent {

  timeLimit: number = Consts.defaultGame_TimeLimit;
  maxRounds: number = Consts.defaultGame_MaxRounds;
  maxWords: number = Consts.defaultGame_MaxWords;
  gameFormGroup = new FormGroup({

    maxTimeFormControl: new FormControl(this.timeLimit, [
      Validators.required,
      Validators.min(1),
      Validators.pattern("^[0-9]*$")
    ]),

    maxRoundsFormControl: new FormControl(this.maxRounds, [
      Validators.required,
      Validators.min(1),
      Validators.pattern("^[0-9]*$")
    ]),

    maxWordsFormControl: new FormControl(this.maxWords, [
      Validators.required,
      Validators.min(1),
      Validators.pattern("^[0-9]*$")
    ])
  });
  maxTimeFormControl = this.gameFormGroup.controls.maxTimeFormControl;
  maxRoundsFormControl = this.gameFormGroup.controls.maxRoundsFormControl;
  maxWordsFormControl = this.gameFormGroup.controls.maxWordsFormControl;
  matcher = new ErrorStateMatcher();
  constructor(private gameService: GameService) {
    localStorage.setItem(Consts.localStorage_isModerator, 'false');
  }

  createGame() {
    this.maxRounds = +this.maxRoundsFormControl.value;
    this.timeLimit = +this.maxTimeFormControl.value;
    this.maxWords = +this.maxWordsFormControl.value;
    this.gameService.initGame(this.maxRounds, this.timeLimit, this.maxWords);
  }
}
