import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const NotFound: FC = () => {
    return (
        <div className="min-h-screen flex flex-col justify-between">
            <img className="w-screen phone:h-[50vh] tablet:h-full flex object-cover opacity-20" src="/assets/box-pattern.svg" alt="" />
            <div className="flex flex-col justify-center items-center phone:my-[15vh] lg:my-[10vw] z-20 absolute w-full">
                <Image src="/assets/dinosaur.svg" width={1080} height={1080} alt="" className="phone:w-12 lg:w-20" />
                <div className="flex gap-2 mt-8">
                    <h1 className="font-bold phone:text-6xl lg:text-9xl text-neutral-50">4</h1>
                    <div className='my-auto'>
                        <Image src="/assets/0.svg" alt='' width={1080} height={1080} className="phone:w-12 phone:h-12 lg:w-24 lg:h-24 my-auto" />
                    </div>
                    <h1 className="font-bold phone:text-6xl lg:text-9xl text-neutral-50">4</h1>
                </div>
                <p className="font-normal phone:text-sm lg:text-lg mt-5 tracking-tighter text-zinc-200">Looks like you are out of boundary...</p>
                <Button size='sm' className="mt-10 text-white rounded-md">
                    <Link href="/">Head to Homepage</Link>
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
