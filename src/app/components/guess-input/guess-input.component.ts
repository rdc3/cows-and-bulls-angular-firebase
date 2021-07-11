import { LoadingService } from './../../services/loading.service';
import { WordlistService } from './../../services/wordlist.service';
import { GameService } from './../../services/game.service';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { GameState, Player } from 'src/app/models/types';
import { MyErrorStateMatcher as ErrorStateMatcher } from 'src/app/common/formValidationLib';
import { Consts } from 'src/app/models/consts';

@Component({
  selector: 'app-guess-input',
  templateUrl: './guess-input.component.html',
  styleUrls: ['./guess-input.component.scss']
})
export class GuessInputComponent implements OnInit {

  @Input() player: Player | null | undefined = new Player(null);
  @Input() myTurn: Boolean = false;
  players: Player[] = [];
  // player: Player = this.gameService.player;
  @Input() protagonist: Player | null | undefined = new Player(null);
  wordsGuessedCount = 0
  // public myTurn = false;
  public WaitingForNextWord = true;
  public placeholderText = 'Enter a 4 letter word';
  public subScript = 'Please enter a 4 letter word';
  public errorMessage = '';
  public guessWordFormControl = new FormControl('', [
    Validators.required,
    this.guessedWordValidator()
  ]);

  matcher = new ErrorStateMatcher();
  constructor(private gameService: GameService, private wordlistService: WordlistService, private loadingService: LoadingService) {
    this.protagonist!.name = 'a player';
    this.gameService.players$.subscribe(p => {
      this.players = p;
      this.player = this.gameService.player;
    });
    this.gameService.game$.subscribe(g => {
      // console.log('protogonist2 :', g)
      this.protagonist = g.round!.turn;
      this.myTurn = this.protagonist?.id === this.player?.id;
      this.WaitingForNextWord = g.state === GameState.WaitingForNextWord;
      this.updateUI();
      // console.log('waitingForGameStart: ', this.WaitingForNextWord, g?.state, GameState.Guessing)
    })
  }
  ngOnInit(): void {
    this.updateUI();
  }
  updateUI() {
    this.protagonist = this.gameService.game.round!.turn;
    this.myTurn = this.protagonist?.id === this.player?.id;
    this.WaitingForNextWord = this.gameService.game.state === GameState.WaitingForNextWord;
    this.players = this.gameService.players;
    this.player = this.gameService.player;
    console.log('protogonist1 :', this.protagonist, this.player, this.myTurn, this.WaitingForNextWord)
    this.subScript = (this.myTurn) ? 'Enter a 4 letter word for others to guess'
      : (this.protagonist) ? `Waiting for ${this.protagonist!.name} to provide a word for guessing` : 'Waiting!!!'

  }

  submit() {
    // this.loadingService.openDialog();
    (this.myTurn) ? this.startTheRound() : this.submitNewGuess();
  }
  submitNewGuess() {
    // this.loadingService.openDialog();
    if (this.guessWordFormControl.valid) {
      this.gameService.newGuess(this.guessWordFormControl.value).subscribe();
      this.guessWordFormControl.reset();
    }
  }
  private startTheRound() {
    if (this.guessWordFormControl.valid) {
      localStorage.setItem(Consts.localStorage_roundStartedAt, new Date().valueOf().toString())
      this.gameService.setNextWord(this.guessWordFormControl.value).subscribe();
      this.guessWordFormControl.reset();
    }
  }

  guessedWordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      this.errorMessage = '';
      let forbidden = control.value?.length != 4;
      const repeatedLetter = control.value?.split("").some((v: any, i: number, a: string[]) => { return a.lastIndexOf(v) != i; });
      const repeatedWord = (!this.myTurn) ? (this.players.map(player => player.guesses.some(guess => guess === control.value)).filter(v => v).length > 0) : false;
      const notInDictionary = !this.wordlistService.isValidWord(control.value);
      if (notInDictionary) this.errorMessage = `Try a valid word.`;
      if (repeatedWord) this.errorMessage = `Someone already tried "${control.value}".`;
      if (repeatedLetter) this.errorMessage = `Letters cannot be repeated.`;
      if (forbidden) this.errorMessage = `Please enter a 4 letter word.`;
      forbidden = forbidden || repeatedLetter || repeatedWord || notInDictionary;
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

}
