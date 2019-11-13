package com.xima.per.controller;

import com.xima.per.entity.User;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;

/**
 * @author: Pxn
 * @date: 2019/11/3 16:41
 */
@RunWith(SpringRunner.class)
@SpringBootTest
class UserControllerTest {

    @Autowired
    private UserController userController;
    @Test
    void save() {
        User user = new User();
        user.setUsername("zs");
        user.setPassword("1234");
        user.setDate(new Date());
        userController.save(user);
    }

    @Test
    void delete() {
//        userController.delete();
    }

    @Test
    void getOne() {
    }

    @Test
    void findAll() {
    }
}