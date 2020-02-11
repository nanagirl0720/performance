package com.xima.per.dao;

import com.xima.per.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author: Pxn
 * @date: 2019/11/3 12:00
 */
public interface UserDao extends JpaRepository<User,Integer> {

}
