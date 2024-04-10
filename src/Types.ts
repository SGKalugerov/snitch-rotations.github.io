export type CustomAction ={
    keybind: string;
    tapTwice?: boolean;
    name: string;
    waitTime?: number;
    stepBack?: boolean;
    hasCastBar?: boolean;
    classification?: ActionClassificationEnum;
    slotIndex: number;
    cooldown?: number;
    type: ActionsEnum;
    conditions?: CustomCondition[];
}

export interface CustomCondition {
    name: ConditionsEnum;
    operator: ' ' | '>' | '<' | '!' | '==' ;
    value: number;
    valueString?: string;
}


export enum ActionClassificationEnum {
    Spell,
    Item,
}

export enum ActionsEnum {
    Dps,
    Buff,
    Pull
}
export enum RoutesEnum
{
    Unknown = 0,
    Grind,
    Graveyard,
    Repair,
    Restock,
    Mail,
    Vendor,
    Recalculate,
    RunningTo
}
export enum ConditionsEnum {
    HealthP = 1,
    ManaP,
    EnemyHealthP,
    EnemyCasting,
    NumberOfMobsAttacking,
    Cooldown,
    HasTarget,
    EnemyHasBuff,
    EnemyHasDebuff,
    PlayerHasBuff,
    PlayerHasDebuff,
    IsAutoShooting,
    HasSoulShards,
    IsAutoAttacking,
    HasPet,
    HasHealthstone,
    ComboPoints,
    HasWeaponEnch,
    PetHealth,
    TimeOutOfCombatSeconds,
    RouteType
}