import { GameTableComponent } from './components/game-table/game-table.component';
import { JoinGameComponent } from './components/join-game/join-game.component';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Consts } from './models/consts';


const routes: Routes = [
  { path: '', component: CreateGameComponent },
  { path: Consts.route_joingame, component: JoinGameComponent },
  { path: Consts.route_game, component: GameTableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
