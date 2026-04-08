import { createFileRoute } from '@tanstack/react-router'
import FormSignin from '~/components/auth/FormSignin'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='w-full h-screen flex justify-center items-center'>
    <div className="flex-1 flex flex-col justify-center items-center">
      <FormSignin />
    </div>
    <div className="flex-1 bg-accent/20 h-full relative">
      <div className="absolute inset-0 z-10 bg-transparent backdrop-blur-sm flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-xl lg:text-2xl font-bold max-w-md leading-tight mb-6">
          Biomedical Engineering Competition 2026
        </h1>

        <p className="text-muted-foreground max-w-md mb-10">
          Kompetisi nasional Teknik Biomedis untuk inovasi teknologi kesehatan.
        </p>
      </div>
      <div 
      className="
        size-72 
        rounded-[60%_40%_55%_45%/55%_60%_40%_45%] 
        bg-primary/60 
        blur-3xl
        absolute 
        top-1/2 
        left-1/2 
        -translate-x-1/2 
        -translate-y-1/2 
        animate-blob
        "
      />
    </div>
  </div>
}
