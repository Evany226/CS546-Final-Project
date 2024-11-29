import { ObjectId } from "mongodb";

export function checkString(str) {
    if(str == undefined){
        throw new Error("String is undefined");
    }
    if(typeof str !== "string"){
        throw new Error("Input expected string, not a string");
    }
    if(str.trim().length === 0){
        throw new Error("String is empty");
    }

    return str.trim();
}

export function checkId(id){
    if(!ObjectId.isValid(id)){
        throw new Error("Id is not a valid object Id")
    }
}