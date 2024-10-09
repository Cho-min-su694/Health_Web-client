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