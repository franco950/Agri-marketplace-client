const url=import.meta.env.VITE_SERVER_URL
type Anyuser= {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    
  };
export async function getProfile():Promise<Anyuser>{
    try{
    const response=await fetch(`${url}/profile`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include",
    
    })
    const myprofile = await response.json(); 
    if (!response.ok) { 
        const error = await response.json();
        throw new Error(error.message || "Request failed")};
  
    
    return myprofile}
    
    catch(error:any) {
        console.error("Error retrieving profile:", error);
        throw new Error(error)} 
  }
export async function changeProfile( updatedFields: Partial<Anyuser>): Promise<number> {
  try {
    const response = await fetch(`${url}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.status;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating profile:', error.message);
      throw new Error(error.message);
    } else {
      console.error('Unknown error updating profile:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

  export async function deleteProfile(){
    try{
    const response=await fetch(`${url}/profile`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include",
    })
    if (!response.ok) { 
        const error = await response.json();
        throw new Error(error.message || "Request failed")};
    
    return response.status}
    
  catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error deleting profile:', error.message);
      throw new Error(error.message);
    } else {
      console.error('Unknown error deleting profile:', error);
      throw new Error('An unknown error occurred');
    }
  }
}