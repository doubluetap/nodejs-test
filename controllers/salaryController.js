const db = require("../config/db");

exports.calculateSalary = (req, res) => {
    const { month, year } = req.body;

    db.query(`
        SELECT 
            e.id AS employee_id,
            e.name,
            e.salary AS base_salary,

            COUNT(DISTINCT a.date) AS work_days,

            IFNULL(SUM(
                TIMESTAMPDIFF(HOUR, o.start_time, o.end_time)
            ), 0) AS overtime_hours

        FROM employees e

        LEFT JOIN attendance a 
            ON e.id = a.employee_id
            AND a.check_in IS NOT NULL
            AND a.check_out IS NOT NULL
            AND MONTH(a.date) = ?
            AND YEAR(a.date) = ?

        LEFT JOIN overtime o 
            ON e.id = o.employee_id
            AND o.status = 'APPROVED'
            AND MONTH(o.date) = ?
            AND YEAR(o.date) = ?

        GROUP BY e.id
    `, [month, year, month, year], (err, data) => {

        if (err) return res.send(err);

        const result = data.map(emp => {

           const overtime_salary = emp.overtime_hours * emp.base_salary;

const total =
    emp.work_days * emp.base_salary
    + overtime_salary;
            return {
                ...emp,
                overtime_salary,
                total
            };
        });

        res.json(result);
    });
};