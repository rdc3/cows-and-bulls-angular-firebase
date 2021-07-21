import { PlayerSelectorService } from './../../services/player-selector.service';
import { GameService } from './../../services/game.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Player } from 'src/app/models/types';
import { MyErrorStateMatcher as ErrorStateMatcher } from 'src/app/common/formValidationLib';
import { Consts } from 'src/app/models/consts';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss']
})

export class JoinGameComponent implements OnInit {
  // players: Player[] = [];
  timeLimit: number = 2;
  maxRounds: number = 4;
  public player: Player;
  gameFormGroup = new FormGroup({
    nameFormControl: new FormControl('', [
      Validators.required,
      this.forbiddenNameValidator()
    ]),

    timeFormControl: new FormControl(this.timeLimit, [
      Validators.required,
      Validators.min(1),
      Validators.pattern("^[0-9]*$")
    ]),

    maxRoundsFormControl: new FormControl(this.maxRounds, [
      Validators.required,
      Validators.min(1),
      Validators.pattern("^[0-9]*$")
    ])
  });
  nameFormControl = this.gameFormGroup.controls.nameFormControl;
  timeFormControl = this.gameFormGroup.controls.timeFormControl;
  maxRoundsFormControl = this.gameFormGroup.controls.maxRoundsFormControl;
  matcher = new ErrorStateMatcher();

  constructor(private gameService: GameService, private playerSelectorService: PlayerSelectorService) { }
  ngOnInit(): void {
    this.player = this.gameService.player;
    if (this.player.name === '') {
      this.player.name = localStorage.getItem(Consts.localStorage_player) || `Player${this.gameService.players$.value.length + 1}`;
    }
    this.nameFormControl.setValue(this.player.name);
  }

  update() {
    if (this.nameFormControl.valid) {
      this.gameService.setPlayerName(this.nameFormControl.value).subscribe();
    } else {
      this.nameFormControl.setValue(localStorage.getItem(Consts.localStorage_player));
    }
  }

  forbiddenNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = control.value && control.value != '' && this.gameService.players$.value.find(p => p.name === control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

  startGame() {
    console.log('starting Game');
    const playing = this.gameService.players$.value.find(p => p.name === this.nameFormControl.value);
    if (!playing) {
      this.gameService.setPlayerName(this.nameFormControl.value).subscribe(
        (val) => {
          if (val) {
            this.playerSelectorService.nextRound();
            this.gameService.startGame();
          }
        }
      );
    }
    else {
      this.playerSelectorService.nextRound();
      this.gameService.startGame();
    }
  }
}
