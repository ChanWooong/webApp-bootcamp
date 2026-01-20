import express from 'express';
import pool from './db.js';

const router = express.Router();    

router.get('/', async (req, res) => {
    // [수정] 불필요한 pool.query() 실행 라인 삭제
    var qry = "Select * from memos";
    try {
        const result = await pool.query(qry);
        res.send({
            success: true,
            memos: result.rows
        });
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        });
    }
});

router.get('/:id', async (req, res) => {
    // [수정] id= 뒤에 $1 을 붙여야 함
    var qry = "Select * from memos where id=$1"; 
    
    // [수정] try 밖에서 pool.query 실행하던 것들 삭제 (이게 에러 원인)
    try {
        const result = await pool.query(qry, [req.params.id]);
        if(result.rowCount === 0) {
            res.status(404).send({ 
                success: false,
                message: "Memo not found"
            });
        }
        else{
            res.send({
                success: true,
                memo: result.rows[0]
            });
        }
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        });
    }
});

router.post('', async (req, res) => {
    // [수정] id는 보통 DB가 알아서 만드니까 뺌 (title, content만 받음)
    var {title, content} = req.body; 
    var qry = "Insert into memos (title, content) values ($1, $2) returning *"; 
    
    try {
        // [수정] 쿼리는 $1, $2 두 개인데 변수는 3개여서 에러남 -> [title, content]로 수정
        // [추가] returning * 을 쿼리에 넣어서 방금 만든 데이터를 바로 받아오게 함
        const result = await pool.query(qry, [title, content]);
        res.send({
            success: true,
            memo: result.rows[0]
        });
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        });
    }
});

router.put('/:id', async (req, res) => {
    var { title, content } = req.body;  
    var {id} = req.params;
    
    // [수정] 줄바꿈 할 때 앞에 띄어쓰기 한 칸씩 추가 (안 하면 에러남)
    var qry = "Update memos set title=$1, content=$2 " // <-- 공백 추가
                + "where id=$3 " // <-- 공백 추가
                + "returning *"; 
    try {
        const result = await pool.query(qry, [title, content, id]); 
        res.send({
            success: true,
            memo: result.rows[0]
        });
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        });
    }   
});

router.delete('/:id', async (req, res) => {
    var {id} = req.params;
    
    // [수정] 줄바꿈 띄어쓰기 추가
    var qry = "Delete from memos where id=$1 " // <-- 공백 추가
              + "returning *";
    try {
        const result = await pool.query(qry, [req.params.id]);
        res.send({
            success: true,
            message: "Memo deleted successfully"
        });
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        });
    }
});

export default router;