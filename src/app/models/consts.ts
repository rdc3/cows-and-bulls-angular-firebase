export class Consts {
    public static readonly db_collection_player = "Players";
    public static readonly db_collection_game = "Game";
    public static readonly db_collection_gameRooms = "GameRooms";
    public static readonly db_collection_chat = "Chat";
    public static readonly route_joingame = "join";
    public static readonly route_game = "game";
    public static readonly localStorage_player = "player";
    public static readonly localStorage_isModerator = "mod";
    public static readonly localStorage_roundStartedAt = "roundStartTime";
    public static readonly defaultGame_TimeLimit: number = 2;
    public static readonly defaultGame_MaxRounds: number = 4;
    public static readonly defaultGame_MaxWords: number = 10;
}