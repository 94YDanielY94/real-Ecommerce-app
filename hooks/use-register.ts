import {
  useMutation,
} from "@tanstack/react-query";


type RegisterData = {
  email:string;
  password:string;
};


export function useRegister() {

  return useMutation({

    mutationFn:
      async (data:RegisterData)=>{

        const res =
          await fetch(
            "/api/signup",
            {
              method:"POST",
              headers:{
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify(data),
            }
          );


        const result =
          await res.json();


        if(!res.ok){
          throw new Error(
            result.message
          );
        }


        return result;
      }

  });

}