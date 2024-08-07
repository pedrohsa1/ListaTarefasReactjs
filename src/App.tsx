import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

export default function App(){

  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);

  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([])

  const [editTask, setEditTask] = useState({
    enabled: false,
    task: ''
  })

  useEffect(() => {
     const tarefaSalvas = localStorage.getItem("@cursoreact") 

    if(tarefaSalvas){
      setTasks(JSON.parse(tarefaSalvas));
    }


  }, [])

  useEffect(() => {
    if(firstRender.current){
      firstRender.current = false;
      return;
    }

    localStorage.setItem("@cursoreact", JSON.stringify(tasks))
    console.log("useEffect foi chamado!")

  }, [tasks]);



  const handleRegister = useCallback(() => {
    if(!input){
      alert("Preencha o nome da sua tarefa!")
      return;
    }

    if(editTask.enabled){
      handleSaveEdit();
      return;
    }


    setTasks(tarefas => [...tarefas, input])
    setInput("")
  }, [input, tasks])



  function handleSaveEdit(){
    const findIndexTask = tasks.findIndex(task => task === editTask.task)
    const allTasks = [...tasks];

    allTasks[findIndexTask] = input;
    setTasks(allTasks);

    setEditTask({
      enabled: false,
      task: ''
    })
    setInput("")

  }

  function handleDelete(item: string){
    const removeTask = tasks.filter( task => task !== item)
    setTasks(removeTask)
  }

  function handleEdit(item: string){

    inputRef.current?.focus();

    setInput(item)
    setEditTask({
      enabled: true,
      task: item
    })

  }


  const totalTarefas = useMemo(() => {
    return tasks.length
  }, [tasks])

  return(
    <div>
      <h1>Lista de tarefas</h1>
      <input
        placeholder="Digite o nome da tarefa..."
        value={input}
        onChange={ (e) => setInput(e.target.value) }
        ref={inputRef}
      />
      <button onClick={handleRegister}>
        {editTask.enabled ? "Atualizar tarefa" : "Adicionar tarefa"}
      </button>

      <hr/>

      <strong>Você tem {totalTarefas} tarefas!</strong>
      <br/><br/>

      {tasks.map( (item, index) => (
        <section key={item}>
          <span>{item}</span>
          <button onClick={ () => handleEdit(item) }>Editar</button>
          <button onClick={ () => handleDelete(item) }>Excluir</button>
        </section>
      ) )}
    </div>
  )
}
