import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
    const [tarefas, setTarefas] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [mostrarTarefas, setMostrarTarefas] = useState(false);
    const [editando, setEditando] = useState(null);

    const API_URL = 'https://tarefas-42xx.onrender.com/';

    useEffect(() => {
        buscarTarefas();
    }, []);

    const buscarTarefas = () => {
        axios.get('https://tarefas-42xx.onrender.com/tarefas')
            .then(response => {
                setTarefas(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar tarefas:', error);
            });
    };

    const adicionarTarefa = () => {
        axios.post('https://tarefas-42xx.onrender.com/tarefas', { titulo, descricao })
            .then(response => {
                setTarefas([...tarefas, response.data]);
                setTitulo('');
                setDescricao('');
                window.alert('Tarefa adicionada com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao adicionar tarefa:', error);
            });
    };

    const deletarTarefa = (id) => {
        axios.delete(`https://tarefas-42xx.onrender.com/tarefas/${id}`)
            .then(() => {
                setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
                window.alert('Tarefa deletada com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao deletar tarefa:', error);
            });
    };

    const iniciarEdicao = (tarefa) => {
        setEditando(tarefa.id);
        setTitulo(tarefa.titulo);
        setDescricao(tarefa.descricao);
    };

    const atualizarTarefa = (id) => {
        axios.put(`https://tarefas-42xx.onrender.com/tarefas/${id}`, { titulo, descricao })
            .then(() => {
                setTarefas(tarefas.map(tarefa => tarefa.id === id ? { ...tarefa, titulo, descricao } : tarefa));
                setTitulo('');
                setDescricao('');
                setEditando(null);
                window.alert('Tarefa atualizada com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao atualizar tarefa:', error);
            });
    };

    const toggleMostrarTarefas = () => {
        setMostrarTarefas(!mostrarTarefas);
    };

    return (
        <div>
            <h1>Lista de Tarefas</h1>
            <div>
                <input
                    type="text"
                    placeholder="Título"
                    value={titulo}
                    onChange={e => setTitulo(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Descrição"
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                />
                {editando ? (
                    <button onClick={() => atualizarTarefa(editando)}>Atualizar Tarefa</button>
                ) : (
                    <button onClick={adicionarTarefa}>Adicionar Tarefa</button>
                )}
                <button onClick={toggleMostrarTarefas}>
                    {mostrarTarefas ? 'Ocultar Tarefas' : 'Ver Todas as Tarefas'}
                </button>
            </div>
            {mostrarTarefas && (
                <ul>
                    {tarefas.map(tarefa => (
                        <li key={tarefa.id}>
                            <h2>{tarefa.titulo}</h2>
                            <p>{tarefa.descricao}</p>
                            <button onClick={() => deletarTarefa(tarefa.id)}>Deletar</button>
                            <button onClick={() => iniciarEdicao(tarefa)}>Editar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;
