package com.xima.per.services;

import com.xima.per.entity.User;

import java.util.List;


public interface UserService {

    public User save(User user);

    public void delete(User user);

    public void deleteById(Integer id);

    public List<User> findAll();

    public User getOne(Integer id);

    public User findById(Integer id);

}
