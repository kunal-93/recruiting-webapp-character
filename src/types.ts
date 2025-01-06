export type Attributes = {
    Strength: number;
    Dexterity: number;
    Constitution: number;
    Intelligence: number;
    Wisdom: number;
    Charisma: number;
};

export type Class = "Barbarian" | "Wizard" | "Bard";


export type Generic = {
    [k: string]: any
    // value: number

}