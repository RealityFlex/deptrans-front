export class BaseDto  {
    id: number = 0;
    name: string = '';
}

export class BaseDtoAvatar extends BaseDto {
    photo_url?: string;
    first_name?: string;
}

export abstract class CursorListDto<T> {
    cursor: number = 0;
    objects: T[] = [];
}