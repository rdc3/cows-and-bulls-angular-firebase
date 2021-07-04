import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameTableComponent } from './components/game-table/game-table.component';
import { PlayersListComponent } from './components/players-list/players-list.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { GameComponent } from './components/game/game.component';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { JoinGameComponent } from './components/join-game/join-game.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WordsListComponent } from './components/words-list/words-list.component';
import { GuessInputComponent } from './components/guess-input/guess-input.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HotTableModule } from '@handsontable/angular';


@NgModule({
  declarations: [
    AppComponent,
    PlayersListComponent,
    GameTableComponent,
    GameComponent,
    CreateGameComponent,
    JoinGameComponent,
    WordsListComponent,
    GuessInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HotTableModule.forRoot(),
    MatToolbarModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatGridListModule, MatTableModule, MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
