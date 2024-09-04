import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface hookMember {
    data: Map<string, any>;
    onChangeData: (key:string, value:any) => void;
    confirmOriginalData: () => void;
}

export function useAdminModifyModal({
    originalData,
    setModifyData
}: {
    originalData: Map<string, any>;
    setModifyData: (data: Map<string, any>)=>void;
}): hookMember {

    const [data, setData] = useState<Map<string, any>>(new Map());

    useEffect(() => {
        setData(new Map(originalData));
    }, [originalData]);

    const onChangeData = (key:string, value:any) => {
        setData((prev) => new Map(prev).set(key, value));
    }

    const confirmOriginalData = () => {
        setModifyData(data);
    }

    return {
        data,
        onChangeData,
        confirmOriginalData
    }
}