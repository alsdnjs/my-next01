import Image from 'next/image';
import "./gallery.css"

function Page(props) {
    return (
        <table>
            <tbody>
            <tr>
                 <p><Image src="/images/tree-1.jpg" width={50} height={50} /></p>  
                 <p><Image src="/images/tree-2.jpg" width={50} height={50} /></p>  
                 <p><Image src="/images/tree-3.jpg" width={50} height={50} /></p>  
            </tr>
            <tr>
                 <p><Image src="/images/tree-4.jpg" width={50} height={50} /></p>  
                 <p><Image src="/images/coffee-blue.jpg" width={50} height={50} /></p>  
                 <p><Image src="/images/tree-1.jpg" width={50} height={50} /></p>  
            </tr>


            </tbody>
       </table>
    );
}

export default Page;