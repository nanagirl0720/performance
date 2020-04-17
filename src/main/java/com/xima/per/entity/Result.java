package com.xima.per.entity;

import javax.persistence.*;

/**
 * @author zd
 * @version v1.0
 * @2020 04 17 09 45
 */
@Entity
@Table(name = "t_result")
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "code")
    private int code;//Result 类是为了构造 response，主要是响应码

    public Result() {
    }

    @Override
    public String toString() {
        return "Result{" +
                "id=" + id +
                ", code=" + code +
                '}';
    }

    public Result(int code) {
        this.code = code;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public Result(Integer id, int code) {
        this.id = id;
        this.code = code;
    }
}
