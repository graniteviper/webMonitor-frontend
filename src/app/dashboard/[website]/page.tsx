"use client";
import axios from 'axios';
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'

const page = () => {
    const {getToken} = useAuth();
    const searchParams = useSearchParams();

    useEffect(()=>{
        const id = searchParams.get("id");
        if(!id){
            alert("No id found");
            (
                <div>
                    Error 404
                </div>
            )
            return;
        }
        // console.log(id);
        (async function(){
            const id = searchParams.get("id");
            console.log(id);
            const token = await getToken();
            const res = await axios.get(`https://uptimechecker-be.onrender.com/api/v1/getone`,{
                params:{
                    websiteId: id
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(res);
        })()
    },[])

  return (
    <div>
      page
    </div>
  )
}

export default page
