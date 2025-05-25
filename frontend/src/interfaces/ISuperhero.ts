interface IImage {
    id: string;
    url: string;
}
export interface ISuperhero {
    nickname: string;
    real_name: string;
    origin_description: string;
    superpowers: string;
    catch_phrase: string;
    image: File | null;
}

export interface ISuperheroGet {
    id?: string;
    nickname: string;
    real_name: string;
    origin_description: string;
    superpowers: string;
    catch_phrase: string;
    images?: IImage[];
}

export interface ISuperheroesTotal {
    superheroes: ISuperheroGet[];
    total: number;
}