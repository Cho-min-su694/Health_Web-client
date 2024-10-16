import { GymMembership } from "src/api/gymMembershipsApi";

export const getCalculatedEndDay = (membershipList:GymMembership[], userId:number, gymId:number) => {

    const compareMembership = membershipList.filter(v=>v.userId == userId && v.gymId == gymId).sort((a,b)=>a.startDay>b.startDay? -1 : a.startDay < b.startDay? 1: 0);

    let startMembership:GymMembership|undefined = compareMembership.find(v=>new Date(v.startDay)<new Date());

    if(!startMembership) return null;

    let endDay:Date = new Date(startMembership.endDay);

    compareMembership.forEach(membership=>{
        if(endDay.getTime()==new Date(membership.startDay).getTime()) endDay = new Date(membership.endDay);
    })

    return endDay;
}

export const dateFormater = (format: string, date: Date = new Date()): string => {
    const _date = date

    return format.replace(/(yyyy|mm|dd|MM|DD|H|i|s)/g, (t: string): any => {
        switch (t) {
            case "yyyy":
                return _date.getFullYear();
            case "mm":
                return _date.getMonth() + 1;
            case "dd":
                return _date.getDate();
            case "MM":
                return String(_date.getMonth() + 1).padStart(2,"0");
            case "DD":
                return String(_date.getDate()).padStart(2,"0");
            case "H":
                return String(_date.getHours()).padStart(2,"0");
            case "i":
                return String(_date.getMinutes()).padStart(2,"0");
            case "s":
                return String(_date.getSeconds()).padStart(2,"0");
            default:
                return "";
        }
    });
};