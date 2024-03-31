export type CustomAction ={
    keybind: string;
    tapTwice?: boolean;
    range?: number;
    name: string;
    waitTime?: number;
    stepBack?: boolean;
    hasCastBar?: boolean;
    classification: ActionClassificationEnum;
    slotIndex: number;
    cooldown?: number;
    type: ActionsEnum;
    conditions?: CustomCondition[];
}

export interface CustomCondition {
    name: ConditionsEnum;
    operator: '>' | '<' | '!' | '==';
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

export enum ConditionsEnum {
    HealthP = 1,
    ManaP,
    EnemyHealthP,
    EnemyCasting,
    NumberOfMobsAttacking,
    Cooldown,
    Range,
    HasTarget,
    EnemyHasBuff,
    EnemyHasDebuff,
    PlayerHasBuff,
    PlayerHasDebuff,
    IsNotAutoShooting,
    HasSoulShards,
    IsNotAutoAttacking,
    HasPet,
    HasHealthstone,
    ComboPoints,
    IsInMeleeRange,
    HasWeaponEnch,
}