import { Injectable } from "@nestjs/common";
import { compareSync, hashSync } from "bcryptjs";

@Injectable()
export class HashingService {
    hash(value: string): string{
        return  hashSync(value, 10)
    }
    compare(value: string, hash: string): boolean{
        return compareSync(value, hash)
    }
}